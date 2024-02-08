systemctl start mongod &
cd client && npm start &
cd server && npm start &
cd mapAPi && uvicorn api:app --port 7777 --reload &
