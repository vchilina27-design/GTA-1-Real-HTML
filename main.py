from flask import Flask, Response

app = Flask(__name__)

@app.route('/raw')
def get_script():
    with open('menu.luau', 'r') as f:
        content = f.read()
    return Response(content, mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
