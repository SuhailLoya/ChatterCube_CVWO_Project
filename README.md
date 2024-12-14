# Introduction

ChatterCube is a curated web forum designed to facilitate meaningful and diverse conversations. It will serve as an intellectual hub where users engage in insightful dialogue across a spectrum of topics. More than just a forum, ChatterCube encourages an environment where users can explore trends, participate in substantive debates, and enjoy amicable discussions. Within the refined confines of ChatterCube, every voice contributes to a richer understanding of the world, fostering an atmosphere of respect and intellectual exchange.

# Setup:

I had to separate my main project into two different repositories for deployment requirements. I have still preserved the original repository.

Original: https://github.com/SuhailLoya/ChatterCube_CVWO_Project (with all the main commits)

Frontend: https://github.com/SuhailLoya/CVWO_ChatterCube_Frontend

Backend: https://github.com/SuhailLoya/CVWO_ChatterCube_Backend

Currently,
The front end is deployed using Vercel at: https://cvwo-frontend-gamma.vercel.app/
The back end is deployed using Render at: https://mysite-muiy.onrender.com/

(note backend is API only and there is no home directory at the backend, so go to https://mysite-muiy.onrender.com/api/v1/topics, which fetches the JSON of current topics on the server)

To make it run locally, please clone both frontend and backend. You would also need to change the API variable in React Components to your local host port.

Also, add your local host port as an origin to cors (under Backend/config/initializers/cors.rb).

Run both front-end and back-end, separately, and access the website via the Front-end application.

Note: Don’t forget the common before-run formalities like npm install, bundle install, initialize, create, and migrate rails db
