# Real Installs Viewer

A web application to check app install statistics from the Google Play Store.

## What It Does
- Searches for any app on the Google Play Store via a simple web interface.
- Shows the app's basic info like developer and title.
- Displays both the formatted install count (e.g., "1,000,000+") and the raw `realInstalls` number.
- Shows the app's rating and total number of reviews.

## How to Use the Web Application

This is the recommended way to use the tool.

### Prerequisites
- Python 3.x
- `pip` (Python package installer)

### Installation & Setup
1.  Make sure you have all the project files, including `app.py`, the `template` directory, and the `static` directory.
2.  Install the required Python packages:
    ```sh
    pip install Flask google-play-scraper
    ```
3.  Run the web application:
    ```sh
    python app.py
    ```
4.  Open your web browser and go to `http://127.0.0.1:5000`.
5.  Enter the name of the app you want to check and click "Search".

---

## Alternative: Command-Line Tool

The project also includes a simple command-line version.

### How to Use
1. Make sure you have Python installed.
2. Install the required package: 
   ```sh
   pip install google-play-scraper
   ```
3. Run the program from your terminal: 
   ```sh
   python rawviewer.py
   ```
4. Enter the name of the app when prompted.

## Note
For best results, use the exact app name as it appears on the Play Store.

Made by Samir (fuddi)