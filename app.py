from flask import Flask, render_template, request, jsonify
from google_play_scraper import search, app as get_app_details

flask_app = Flask(__name__, template_folder='template')

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
            return{"error:" "No results found for the app, try entering the app name from the playstore for best results"}
        
        best_match = None
        best_score = -1
        app_name_lower = app_name.lower()

        for app in results:
            title = app.get('title','')
            title_lower = title.lower()


            score = 0
            if app_name_lower == title_lower:
                score = 100
            elif app_name_lower in title_lower:
                score = 80 + (len(app_name_lower)/len(title_lower)*10)

            if score>best_score:
                best_score = score
                best_match = app

        if not best_match:
            best_match = results[0]

        app_id = best_match['appId']
        print(f"Found Best matching app : {best_match.get('title')}(ID:{app_id})")    

        app_details = get_app_details(
            app_id,
            lang='en',
            country='us'
        )

        installs = app_details.get('installs', 'Not avialable')
        real_installs = app_details.get('realInstalls')

        score = app_details.get('score', 'N/A')
        ratings = app_details.get('ratings', 0)

        if ratings is None:
          ratings = 0 

        return{
            "title": app_details.get('title','N/A'),
            "developer": app_details.get('developer', 'N/A'),
            "installs": installs,
            "realInstalls":real_installs,
            "score":score,
            "ratings":ratings
        }
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return {"error":str(e)}
    
@flask_app.route('/')
def index():
    return render_template('index.html')


#sameeha is a nerd 🤓
#samir is also a nerd 🤓


@flask_app.route('/search', methods=['POST'])
def serch_app():
    app_name = request.json.get('app_name', '')
    if not app_name:
        return jsonify({"error":"App name is required"}),400
    
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
    flask_app.run(debug=True)
