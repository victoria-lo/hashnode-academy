import requests
import pickle
import random
from flask import Flask, jsonify, request

app = Flask(__name__, static_folder='build', static_url_path='')

# Hashnode GraphQL API endpoint
hashnode_api_url = 'https://gql.hashnode.com'


# Fetch articles from Hashnode using GraphQL with pagination
def fetch_articles_with_pagination(query, variables, total_articles):
    all_articles = []

    while len(all_articles) < total_articles:
        response = requests.post(hashnode_api_url, json={'query': query, 'variables': variables})
        data = response.json()

        articles = data.get('data', {}).get('feed', {}).get('edges', [])
        all_articles.extend(articles)

        page_info = data.get('data', {}).get('feed', {}).get('pageInfo', {})
        has_next_page = page_info.get('hasNextPage', False)
        end_cursor = page_info.get('endCursor', '')

        if has_next_page:
            variables["after"] = end_cursor
        else:
            break

    return all_articles[:total_articles]


def fetch_tag_ids(query, tag_slugs):
    tag_ids = []
    i = 0
    while len(tag_ids) < len(tag_slugs):
        response = requests.post(hashnode_api_url, json={'query': query, 'variables': {
            "slug": tag_slugs[i]
        }})
        data = response.json()

        tag_id = data.get('data', {}).get('tag', {}).get('id', '')
        tag_ids.append(tag_id)
        i += 1
    return tag_ids


# Using trained model, categorize Hashnode article indexes by difficulty
def categorize_hashnode_articles(data):
    articles = []
    for article in data:
        title = article['node'].get('title', '')
        markdown_content = article['node'].get('content', {}).get('markdown', '')
        articles.append(title + ' ' + markdown_content)

    # Load ML model from disk
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
        predictions = model.predict(articles)
        article_index_by_difficulty = {
            'Beginner': [],
            'Novice': [],
            'Intermediate': [],
            'Advanced': [],
            'Expert': []
        }
        for i, category in enumerate(predictions):
            if category == 'Beginner':
                article_index_by_difficulty['Beginner'].append(i)
            elif category == 'Novice':
                article_index_by_difficulty['Novice'].append(i)
            elif category == 'Intermediate':
                article_index_by_difficulty['Intermediate'].append(i)
            elif category == 'Advanced':
                article_index_by_difficulty['Advanced'].append(i)
            elif category == 'Expert':
                article_index_by_difficulty['Expert'].append(i)

        return article_index_by_difficulty


def pick_one_random_article(articles, article_index_list):
    if len(article_index_list) > 0:
        return articles[random.choice(article_index_list)]
    return 'Unavailable'


# ====================================== POST METHODS =================================================
@app.route('/learning-path', methods=["GET"])
def get_learning_path():
    # ================================ HASHNODE API VARIABLES - DON'T TOUCH! ======================================
    fetch_tag_query = '''
    query Tag($slug: String!) {
      tag(slug: $slug) {
        id
      }
    }
    '''

    total_articles_to_fetch = 1000
    fetch_article_query = '''
    query Feed(
      $first: Int!,
      $after: String
      $filter: FeedFilter
    ) {
      feed(
        first: $first,
        after: $after,
        filter: $filter
    ) {
        edges {
            node {
                title
                subtitle
                content{
                    makrdown
                }
                author{
                    name
                }
                url
                coverImage{
                    url
                }
            }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
    }
    }
    '''
    # ====================================================================================================

    tags = request.args.get('tags') or ''

    # Fetch tag ids from Hashnode API
    tag_ids = fetch_tag_ids(fetch_tag_query, tags.split(","))

    print("Fetched tag ids: ", tag_ids)

    # Fetch articles from Hashnode API
    article_query_variables = {
        "first": 50,  # Fixed to 50 as per Hashnode API limit
        "after": "",  # Start with no after cursor
        "filter": {
            "tags": tag_ids
        }
    }

    hashnode_articles = fetch_articles_with_pagination(
        fetch_article_query, article_query_variables, total_articles_to_fetch
    )

    print("No. of articles fetched: " + str(len(hashnode_articles)))

    hashnode_article_index_by_difficulty = categorize_hashnode_articles(hashnode_articles)
    learning_path = {
        "Beginner": pick_one_random_article(
            hashnode_articles, hashnode_article_index_by_difficulty["Beginner"]
        ),
        "Novice": pick_one_random_article(
            hashnode_articles, hashnode_article_index_by_difficulty["Novice"]
        ),
        "Intermediate": pick_one_random_article(
            hashnode_articles, hashnode_article_index_by_difficulty["Intermediate"]
        ),
        "Advanced": pick_one_random_article(
            hashnode_articles, hashnode_article_index_by_difficulty["Advanced"]
        ),
        "Expert": pick_one_random_article(
            hashnode_articles, hashnode_article_index_by_difficulty["Expert"]
        )
    }

    return jsonify({'learning_path': learning_path})


if __name__ == "__main__":
    app.run()
