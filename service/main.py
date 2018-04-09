from flask import Flask

app = Flask('cilantro')

@app.route('/')
def index():
    return 'cilantro is up and running ...'
