# Readme

## Astro site

```sh
git clone git@github.com:ropaolle/ps4covers.git

nvm install --lts
sudo apt-get update && sudo apt-get install -y libatomic1
node -v

npm create astro@latest
cd ./magical-meteor
npm run dev
```

## Download PS4 covers

Python script som laddar ner omslagsbilder till PS4 spel från PSN. Jag kan använda mina egna behörighetskoder. Scriptet ska hämta alla omslag baserat på en list med TITLE-ID av typen CUSA24767, CUSA16596, CUSA15717, CUSA00419.

- [Covers](https://cdn.mobygames.com/covers/3778724-littlebigplanet-3-playstation-3-front-cover.jpg)

- Gå till `https://www.playstation.com/` och logga in.
- Gå till `https://ca.account.sony.com/api/v1/ssocookie`, kopiera `npsso` och lägg in den i scriptet.

```sh
mkdir PS4
cd PS4
python3 -m venv venv
source venv/bin/activate
# pip install psnawp requests
python dlps4.py
```
