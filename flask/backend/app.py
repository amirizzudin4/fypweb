from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import model
from datetime import datetime
from datetime import timedelta
import requests
import urllib
import lxml
from bs4 import BeautifulSoup
from bs4 import NavigableString

# from plotly import py
# from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
# import plotly.graph_objs as go
# init_notebook_mode(connected=True)

app = Flask(__name__)


@app.route('/')
def return_another():
    return 'lol hohoho'


@app.route('/api', methods=['POST', 'GET'])
def original_data():
    symb = ''
    if request.method == 'POST':
        if request.accept_mimetypes.accept_json:
            symbpost = request.get_json(force=True)
            print(symbpost.symbol)
        else:
            symbpost = request.form['symbol']

        url = 'https://finance.yahoo.com/quote/'+symbpost+'/history?p='+symbpost
    else:
        symb = request.args.get('symbol')
        url = 'https://finance.yahoo.com/quote/'+symb+'/history?p='+symb

    requesting = requests.get(url)
    soup = BeautifulSoup(requesting.text, 'html.parser')
    table_big = soup.find('table', attrs={'data-test': 'historical-prices'})
    soup.find('tfoot').decompose()

    missing_values = ["n/a", "na", "-", "NaN"]
    rs = pd.read_html(str(table_big), na_values=missing_values)
    rs = rs[0].to_json(orient='records')

    return rs


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
