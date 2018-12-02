from flask import Flask
app = Flask(__name__)


@app.route('/')
def return_hello():
    return 'hello from flask docker conatiner '


@app.route('/hello')
def return_another():
    return 'lol hohoho'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
