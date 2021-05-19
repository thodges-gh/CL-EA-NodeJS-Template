## Run

Clone this repo and change "ExternalAdapterProject" below to the name of your project

```bash
git clone https://github.com/vatsal095/ChainLink_Adapter.git ExternalAdapterProject
```

Enter into the newly-created directory

```bash
cd ExternalAdapterProject
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

```bash
yarn start
```

## Call the external adapter/API server

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": {"action": "address array","value": "0xC96f6B72843Af1988C98F78eAB3E47673af63eA1" } }```

