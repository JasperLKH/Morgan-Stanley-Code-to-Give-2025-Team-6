# Morgan-Stanley-Code-to-Give-2025-Team-6
Morgan Stanley Code to Give 2025 Team 6

## Frontend
Setup guide
```
  npm i

  npm run dev
```

## Backend
Setup guide
```
#init setup
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

#to run server
python manage.py runserver
```

Make Migratons & Migrate
```
python manage.py makemigrations
python manage.py migrate
```

Admin page (for viewing database) route: 
```
localhost:8000/admin
username: admin
password: 1234
```

