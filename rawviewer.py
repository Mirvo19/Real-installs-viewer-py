from google_play_scraper import app, search
 

def  installs(app_name):
    try:
        print(f"searching for {app_name} on the store....")
        result = search(  
            app_name,
            lang='en',
            country='us'
        )
        if not result:  
            print("No app found please try inputting the full app name copying from the playstore")
            return

        app_id = result[0]['appId']   
        print(f"Found an app with id{app_id}")
        app_details = app(
            app_id,
            lang='en',
            country='us'
        )

        installs=app_details.get('installs','Not available')
        real_installs=app_details.get('realInstalls',None)  

        print(f"\n appname:{app_details.get('title','N/A')}")
        print(f"developer:{app_details.get('developer','N/A')}")  
        print(f"installs:{installs}")
        if real_installs is not None:
            print(f"Real installs:{real_installs:,}")
        
        score = app_details.get('score','N/A')
        ratings = app_details.get('ratings',0)
        if ratings is None:
            ratings = 0
        print(f"Score:{score}({ratings:,}ratings)")
    except Exception as e:
        print(f"error occured: {str(e)}")
    
if __name__ == "__main__":
    print("---------------------------------------")
    print("---------------------------------------")
    print("|||   Realinstalls viewer started   |||")
    print("---------------------------------------")
    print("---------------------------------------")
    print("|||                :)            |||")
    print("---------------------------------------")
    print("---------------------------------------")
    print("|||      Made BY: Samir(fuddi)      |||")
    print("---------------------------------------")
    print("---------------------------------------")
    print("|||      Please input real playstore name for more accuracy      |||")
    app_name = input("Enter app name: ")
    installs(app_name)
    input('press enter to exit....')