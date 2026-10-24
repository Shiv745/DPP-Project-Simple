# DPP-Project-Simple

## Digital Product Passport & Circularity Assessment

> A Dockerized prototype for registering industrial motors, reviewing their product information, and exploring machine-learning condition predictions alongside circularity recommendations.

**Project presentation**

- **Purpose:** Demonstrate how digital product records and end-of-life decision support can be brought together in one application.
- **Built with:** React, TypeScript, Vite, FastAPI, Python, and scikit-learn.
- **Run locally:** Docker Compose
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 1. The problem

Product and component information is often scattered across systems, making it harder to understand a product's materials, condition, and potential next use. This project demonstrates a simple way to bring key product details and assessment results into one digital passport workflow.

## 2. The solution

The application lets a user view sample motor records, register another product, and submit operating and circularity inputs for an assessment. The backend returns a condition prediction, a weighted circularity score, and a suggested outcome: **Reuse**, **Remanufacture**, or **Recycle**.

This is a learning and demonstration prototype. Its recommendations are not a substitute for engineering inspection or a production lifecycle assessment.

## 3. How it works

```text
User
  │
  ▼
React + TypeScript frontend (port 5173)
  │  HTTP requests
  ▼
FastAPI backend (port 8000)
  ├── Product registration and listing
  ├── ML condition prediction using the bundled model
  └── Circularity score and recommendation
```

Docker Compose builds and starts the frontend and backend services together.

## 4. Main features

- **Product passport list:** View registered sample motors and their basic identifying details.
- **Product registration:** Add a product ID, name, model number, component, and material.
- **Condition assessment:** Submit air temperature, process temperature, rotational speed, torque, and tool wear.
- **Circularity assessment:** Set recyclability, reusability, repairability, and material-recovery scores.
- **Decision support:** See the predicted condition, model confidence, circularity score, recommendation, and rationale.
- **API documentation:** Explore and try the backend endpoints through FastAPI's interactive documentation.
- **Dockerized development:** Build and run both application services with one Compose command.

The circularity score is a weighted combination of the four supplied scores: recyclability (30%), reusability (25%), repairability (20%), and material recovery (25%). The backend uses the bundled model when available; its code also provides a fallback prediction if the model file is absent.

## 5. Technology

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI, Uvicorn |
| Assessment | scikit-learn, NumPy, bundled Joblib model |
| Containers | Docker, Docker Compose |

## 6. Run the project

You will need Docker Desktop with Docker Compose available.

From the project root, run:

```bash
docker compose up --build
```

Then open:

- **Web application:** [http://localhost:5173](http://localhost:5173)
- **API documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **API health message:** [http://localhost:8000/](http://localhost:8000/)

Stop the services with:

```bash
docker compose down
```

## 7. API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Confirm that the API is running |
| `GET` | `/products` | List products |
| `POST` | `/products` | Register a product |
| `POST` | `/products/{product_id}/assess` | Assess condition and circularity |

For request fields and interactive examples, visit `/docs` while the containers are running.

## 8. Work completed

- Built a React and TypeScript interface for the product list, registration form, and assessment workflow.
- Implemented FastAPI endpoints for listing and registering products and returning assessment results.
- Connected the interface to the backend API.
- Added a bundled machine-learning model and condition-prediction flow.
- Implemented a weighted circularity score and reuse/remanufacture/recycle recommendations.
- Added Dockerfiles and Docker Compose configuration for the frontend and backend.
- Documented how to start and stop the application and where to access each service.
- Uploaded the project to the GitHub repository's `main` branch.

## 9. What to do after opening a pull request

1. **Check the PR details:** Confirm the title, description, changed files, and target branch are correct.
2. **Run project checks:** Build the Docker services and test the frontend, API, product registration, and assessment flow.
3. **Review the changes:** Ask a collaborator to review the code and confirm the README matches the implementation.
4. **Address feedback:** Make requested changes, commit them to the PR branch, and push; the PR will update automatically.
5. **Wait for required checks and approval:** Resolve any failing checks or review comments before merging.
6. **Merge the PR:** Use the repository's merge method once it is approved and all required checks pass.
7. **Verify after merge:** Confirm the changes are on the target branch and that the application still builds and runs.
8. **Clean up:** Delete the feature branch if it is no longer needed, then update your local checkout.

Example commands after the PR is merged:

```bash
git checkout main
git pull origin main
docker compose up --build
```

## 10. Next improvements

- Persist product records in a database instead of the current in-memory backend list.
- Add automated tests for API endpoints, scoring, recommendations, and frontend flows.
- Add input-range validation and clearer error handling.
- Make the frontend API address configurable for deployment outside a developer's machine.
- Add authentication and authorization before exposing product data beyond local development.
- Validate the model and recommendation rules with representative data and domain experts.

## Prototype notes

- The backend currently stores registered products in memory; they reset when the backend process restarts.
- The frontend is configured to call the backend at `http://localhost:8000`, which suits local Docker development but should be configurable for other environments.
- Treat model predictions and circularity recommendations as demonstration outputs, not certified operational guidance.
