rm -rf /usr/share/nginx/html/*


MY_PUBLIC_IP=$(curl https://api.ipify.org)
echo "\033[47m\033[31m{$MY_PUBLIC_IP}\033[0m"


echo -e "\033[47m\033[31mактивация venv\033[0m"
cd /usr/share/nginx/html
python3  -m venv venv
git clone https://github.com/uejhd123/workingcom.git
sudo mv workingcom/workingcomlayout2-main/* ./
sudo rm -rf workingcom/workingcomlayout2-main workingcom/work
source venv/bin/activate 

sed -i 's/pywin32==306//g' workingcom/requirments.txt
sed -i "s/ALLOWED_HOSTS = []/ALLOWED_HOSTS = [$MY_PUBLIC_IP, 'localhost']/g" workingcom/workingcom/settings.py
pip3 install -r workingcom/requirments.txt
sed  -i 's/root \/var\/www\/html/root \/usr\/share\/nginx\/html/g' /etc/nginx/sites-available/default
systemctl restart nginx
 sed -i "s/localhost:8000/$MY_PUBLIC_IP:8000/g" js/*.js
 sed -i "s/localhost:7000/$MY_PUBLIC_IP/g" js/*.js
echo -e "\033[47m\033[31mприменение sed завершено\033[0m"

echo -e "\033[47m\033[31mзапуск проекта\033[0m"
python3 workingcom/manage.py makemigrations
python3 workingcom/manage.py migrate
nohup python3 workingcom/manage.py runserver 0.0.0.0:8000