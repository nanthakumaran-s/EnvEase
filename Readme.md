# EnvEase

Share environment variables and secrets within teams easily and securely.

### Features

- [x] Specified roles for specified user
- [x] Integrated CLI
- [x] Admin dashboard

### Stack

- `Frontend`: React Js
- `Backend`: .NET
- `CLI`: Node Js
- `Cloud`: Azure - Azure App Service (Web App & Static Website), KeyVault, SQL Database, Redis Cache
- `CI/CD`: GitHub Actions
    1. Frontend Deploy Pipeline: Build and deploy frontend react project to Azure AppService (Static Website)
    2. Backend Deploy Pipeline: Build and deploy backend .NET project to Azure AppService (WebApp)
    3. CLI Release: Build binary files and create release

## CLI Instructions

- `login`: Enter your credentials to login in to your envease account
- `logout`: Logout of your current envease account
- `inject`: Inject `.env` file for a specified project
- `share`: Share `.env` file for a specified project

## Local usage guide

Clone the repo and start `docker daemon`

> Change the KeyVault URI or else include `dbString` and `redisConnectionString` in `appSettings.json`. Change the `BASE_URL` on frontend and cli which are under `utils/constants.js`

```sh
docker compose up
```

### Architecture diagram

<img width="652" alt="image" src="https://github.com/nanthakumaran-s/EnvEase/assets/59391441/c3bca8d2-f046-4a3d-8051-43339967f4ce">

### Frontend Snapshots

![landing](https://github.com/nanthakumaran-s/EnvEase/assets/59391441/b5a86583-7a4c-448e-9a56-1448f70897f3)
![secrets](https://github.com/nanthakumaran-s/EnvEase/assets/59391441/5612ac57-ca8b-4241-bc7d-37cbe5d8c18a)
![members](https://github.com/nanthakumaran-s/EnvEase/assets/59391441/b90b0707-08eb-48aa-b158-7c06270b003a)
![project settings](https://github.com/nanthakumaran-s/EnvEase/assets/59391441/8c495bf0-1e46-4ad9-a4bd-71f936edf9f9)
![settings](https://github.com/nanthakumaran-s/EnvEase/assets/59391441/5bf6d525-c08a-4e36-b725-04670b5ffc0f)

## Things to complete

- [ ] Type based access rather than project based access
- [ ] E2EE (End to end encryption)
- [ ] Packages for languages for accessing env variables programmatically
