clone repository

For UI Project Angular:

Ubutunu:
sudo -s
sudo apt update
sudo apt install nodejs npm
npm install -g @angular/cli

Windows:
install node from https://nodejs.org/en/download/
npm install -g @angular/cli



For Backend Flask:

Ubuntu:
sudo apt update
sudo apt install python3 python3-pip tmux htop
apt install pip
pip install Flask
pip install -U flask-cors

windows:
Download python:
https://www.python.org/downloads/
python -m pip install --upgrade pip
pip install flask
pip install -U flask-cors

Start backend application
go to project folder
cd DEW_Backend
python new.py
It starts running on localhost:5000

Start UI 
go to project folder
cd UI
ng serve
It start running on locahost:4200

In browser, run localhost:4200 => where you can see the app.



