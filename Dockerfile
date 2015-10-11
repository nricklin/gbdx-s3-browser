############################################################
# Dockerfile to build Python WSGI Application Containers
############################################################

FROM centos

# Install basic applications
RUN yum -y update
RUN yum -y install git wget gcc python-devel
ENV PATH /usr/pgsql-9.4/bin/:$PATH
# Get and install pip
RUN wget https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py

# Copy the application folder inside the container
ADD . /code/

# Get pip to download and install requirements:
RUN cd /code && pip install -r requirements.txt

# Expose ports
EXPOSE 8080

# Set the default directory where CMD will execute
WORKDIR /code

# Default env vars:
ENV GBDX_API_KEY your_key_here
ENV TOKEN_URL https://geobigdata.io/auth/v1/oauth/token/
ENV S3CREDS_URL https://geobigdata.io/s3creds/v1/prefix

# Set the default command to execute
# when creating a new container
# i.e. using CherryPy to serve the application
CMD python application.py