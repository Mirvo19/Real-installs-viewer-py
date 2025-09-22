from flask import Flask, render_template, request, jsonify, redirect, url_for
import requests # You'll need to import the requests library
from google_play_scraper import search, app as get_app_details

flask_app = Flask(__name__, template_folder='template')

@flask_app.route('/send-suggestion', methods=['POST'])
def send_suggestion():
    data = request.get_json()
    embed = data.get('embed')
    webhook_url = 'https://discord.com/api/webhooks/1419554816367132715/fEOkIS65wGzjxrksD3kXgjUb_GcwySRmbHsWdfMUWcWITxlm6jeKYZo9rAr5bVLAZ6Ob'
    try:
        resp = requests.post(webhook_url, json={'embeds': [embed]})
        resp.raise_for_status()
        return '', 204
    except Exception as e:
        return {'error': str(e)}, 500


flask_app = Flask(__name__, template_folder='template')
@flask_app.route('/send-suggestion', methods=['POST'])
def send_suggestion():
    data = request.get_json()
    embed = data.get('embed')
    webhook_url = 'https://discord.com/api/webhooks/1419554816367132715/fEOkIS65wGzjxrksD3kXgjUb_GcwySRmbHsWdfMUWcWITxlm6jeKYZo9rAr5bVLAZ6Ob'
    try:
        resp = requests.post(webhook_url, json={'embeds': [embed]})
        resp.raise_for_status()
        return '', 204
    except Exception as e:
        return {'error': str(e)}, 500

def get_app_data(app_name):
    try:
        print(f"Searching for '{app_name}' on the play store....")

        results = search(
            app_name,
            lang='en',
            country='us',
            n_hits=5
        )

        if not results:
            return {"error": "No results found for the app. Try entering the app name from the Play Store for best results."}
        
        best_match = None
        app_name_lower = app_name.lower()

        # Prioritize exact match
        for app in results:
            if app.get('title', '').lower() == app_name_lower:
                best_match = app
                break
        
        # If no exact match, take the first result
        if not best_match:
            best_match = results[0]

        app_id = best_match['appId']
        print(f"Found Best matching app: {best_match.get('title')} (ID:{app_id})")    

        app_details = get_app_details(
            app_id,
            lang='en',
            country='us'
        )

        return {
            "title": app_details.get('title', 'N/A'),
            "developer": app_details.get('developer', 'N/A'),
            "installs": app_details.get('installs', 'Not available'),
            "realInstalls": app_details.get('realInstalls'),
            "score": app_details.get('score', 'N/A'),
            "ratings": app_details.get('ratings', 0)
        }
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {"error": "An error occurred while fetching app data."}
    
@flask_app.route('/')
def index():
    return render_template('index.html')

@flask_app.route('/suggestions')
def suggestions():
    return render_template('suggestions.html')

#sameeha is a nerd 🤓
#samir is also a nerd 🤓


@flask_app.route('/search', methods=['POST'])
def search_app():
    app_name = request.json.get('app_name', '')
    if not app_name:
        return jsonify({"error": "App name is required"}), 400
    
    app_name_lower = app_name.lower()
    if app_name_lower == 'sameeha':
        return jsonify({
            "title": "Sameeha is a nerd 🤓",
            "developer": "Top Secret",
            "installs": "Classified",
            "realInstalls": "9999999+",
            "score": "5.0",
            "ratings": "100000+"
        })
    if app_name_lower == 'samir':
        return jsonify({
            "title": "Samir is also a nerd 🤓",
            "developer": "Top Secret",
            "installs": "Classified",
            "realInstalls": "9999999",
            "score": "5.0",
            "ratings": "100000+"
        })

    return jsonify(get_app_data(app_name))

app = flask_app

if __name__ == '__main__':
    app.run(debug=True)
