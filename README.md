# gbdx-s3-browser
Simple web GUI for browsing/downloading S3 attached to a GBDX account

Run Locally (without Docker):
--------
```bash
# Clone the repo and cd inside:
git clone https://github.com/nricklin/gbdx-s3-browser
cd gbdx-s3-browser

# Create a virtualenv and install python requirements
virtualenv venv
. venv/bin/activate
pip install -r requirements.txt

# set required env vars
export GBDX_API_KEY=<YOUR_GBDX_API_KEY>
export TOKEN_URL=https://geobigdata.io/auth/v1/oauth/token/
export S3CREDS_URL=https://geobigdata.io/s3creds/v1/prefix

# run the application
python application.py
```
