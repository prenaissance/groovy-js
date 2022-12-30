# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Setup

For this project the following dependencies are needed cloud-first:

- azure blob storage
- oauth provider

_(the rest of the services will be dockerized later)_

### Azure Blob Storage

Make a resource group:

```bash
LOCATION=westeurope
RG_NAME=groovy-js
az group create --location $LOCATION --name $RG_NAME
```

Create a storage account:

```bash
STORAGE_NAME=groovyjs
az storage account create --name $STORAGE_NAME --resource-group $RG_NAME --location $LOCATION --sku Standard_LRS --kind StorageV2
az storage container create --name songs --account-name $STORAGE_NAME --auth-mode login
```

And finally get the storage account key and set it as an environment variable:

```bash
az storage account keys list --account-name $STORAGE_NAME --resource-group $RG_NAME --query "[0].value" --output tsv
```

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
