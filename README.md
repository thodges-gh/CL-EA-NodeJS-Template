## Run

Clone this repo and change "ExternalAdapterProject" below to the name of your project

```bash
git clone https://github.com/vatsal095/Spectral_Adapter.git
```

Enter into the newly-created directory

```bash
cd Spectral_Adapter
```

You can remove the existing git history by running:

```bash
rm -rf .git
```

See [Install Locally](#install-locally) for a quickstart

## Input Params

```json
{
  "addresses": [
    "0x71B274ddd46a15f5324a4B3F40543af3869DE8B0",
    "0x97b90FBc8904F861F76CB06BFa0A465b72C5E662",
    "0xB5600a26257786A173852c176cb8e286B637af80",
    "0x6801b5ae5781c93Be0F7d223DB72B4E6e56c8Bf6"
  ],
  "job_type": "calculate"
}
```

## Output

```json
{
  "message": "job_created",
  "job_id": "2ed72dd9-bc03-49c3-a189-82885b4b9216"
}
```

## Install Locally

Install dependencies:

```bash
yarn
```

### Test

Run the local tests:

```bash
yarn test
```

Natively run the application (defaults to port 8080):

### Run

(Optional) Compile the code

```bash
yarn build
```

Run the code

```bash
yarn start
```

### Local Development

Run the code with ts-node.

This is not the way the code is run in production, but is convenient for local development to avoid having to compile changes.

```bash
yarn dev
```

## Call the external adapter/API server POST

```bash
curl -X POST -H "content-type:application/json" "http://18.191.166.107/api/submit/" --data '{"addresses": ["0x71B274ddd46a15f5324a4B3F40543af3869DE8B0","0x97b90FBc8904F861F76CB06BFa0A465b72C5E662","0xB5600a26257786A173852c176cb8e286B637af80","0x6801b5ae5781c93Be0F7d223DB72B4E6e56c8Bf6"],"job_type": "calculate"}'
```

## Output

{"message":"job_created","job_id":"48b5c100-5e59-40e0-87cc-315b775f9bee"}

## Call the external adapter for fetching score using GET

```bash
curl -X GET "http://18.191.166.107/api/resolve/<job_id>/"
```
