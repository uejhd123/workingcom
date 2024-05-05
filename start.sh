sudo apt update && sudo apt upgrade -y
sudo apt install python3.10-venv -y
sudo apt install nginx -y
sudo apt install git -y
sudo apt install python3-pip -y
sudo apt install mysql-server -y
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential -y
sudo apt install pkg-config -y
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev
sudo apt install -y python3-venv


echo "CREATE USER if not exists 'workingcomAdmin'@'localhost' IDENTIFIED BY 'Admin_1234';
GRANT ALL PRIVILEGES ON *.* TO 'workingcomAdmin'@'localhost' WITH GRANT OPTION;
CREATE DATABASE if not exists workingcom;
FLUSH PRIVILEGES;
" > db.sql
sudo mysql < db.sql

cd /usr/share/nginx/html
python3  -m venv venv
git clone https://github.com/uejhd123/workingcom.git
sudo mv workingcom/workingcomlayout2-main/* ./
sudo rm -rf workingcom/workingcomlayout2-main workingcom/work

source venv/bin/activate
echo "venv activate"
sed -i 's/pywin32==306//g' workingcom/requirments.txt
sed -i 's/ALLOWED_HOSTS = ['178.154.227.55', 'localhost', '127.0.0.1', 'localhost:7000']/ALLOWED_HOSTS = ['178.154.227.55', 'localhost']/g' workingcom/workingcom/settings.py
pip3 install -r workingcom/requirments.txt
sed  -i 's/root \/var\/www\/html/root \/usr\/share\/nginx\/html/g' /etc/nginx/sites-available/default
systemctl restart nginx
sed -i 's/localhost:8000/ВСТАВИТЬ АДРЕС/g' js/*.js
sed -i 's/localhost:7000/ВСТАВИТЬ АДРЕС/g' js/*.js

python3 workingcom/manage.py makemigrations
python3 workingcom/manage.py migrate
nohup python3 workingcom/manage.py runserver 0.0.0.0:8000