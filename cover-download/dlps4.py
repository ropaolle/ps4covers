import os
import requests
import json
from psnawp_api import PSNAWP
from psnawp_api.models.trophies.trophy_constants import PlatformType
from psnawp_api.models.search import SearchDomain

# Din 64-tecken långa NPSSO-kod
NPSSO_TOKEN = "MkNRKh9z7EDCifCA16B7iCUS3r5ln0EU299Vph3yNAigxkvChRTe2UWEqiIAliPz"

# Misslyckade nedladdningar: ['CUSA24769', 'CUSA07737', 'CUSA00473', 'CUSA34384', 'CUSA00315', 'CUSA16164', 'CUSA31579', 'CUSA42371', 'CUSA00069', 'CUSA37521', 'CUSA23978', 'CUSA13794', 'SCUS94221', 'CUSA40840', 'SLUS21397', 'SLUS20666', 'CUSA30423', 'CUSA11454', 'CUSA00010', 'CUSA45506', 'CUSA29190', 'CUSA32184', 'CUSA45894']
TITLE_IDS = ["CUSA24769", "CUSA16596", "CUSA00419", "CUSA15717", "CUSA04552", "CUSA07737", "CUSA00341", "CUSA00107", "CUSA05573", "CUSA26738", "CUSA05794", "CUSA03041", "CUSA05597", "CUSA00473", "CUSA10237", "CUSA34384", "CUSA01615", "CUSA07211", "CUSA03448", "CUSA03440", "CUSA18522", "CUSA09311", "CUSA04647", "CUSA06886", "CUSA04294", "CUSA13339", "CUSA03144", "CUSA00479", "CUSA10416", "CUSA02532", "CUSA08801", "CUSA26968", "CUSA09869", "CUSA00234", "CUSA17050", "CUSA00642", "CUSA04027", "CUSA00909", "CUSA04263", "CUSA05725", "CUSA03048", "CUSA01256", "CUSA00315", "CUSA31559", "CUSA06819", "CUSA13689", "CUSA19445", "CUSA00562", "CUSA25754", "CUSA18065", "CUSA13529", "CUSA24899", "CUSA04311", "CUSA16164", "CUSA01829", "CUSA03174", "CUSA12289", "CUSA12280", "CUSA12279", "CUSA10872", "CUSA08809", "CUSA31579", "CUSA02353", "CUSA26054", "CUSA42371", "CUSA02195", "CUSA36843", "CUSA00069", "CUSA27145", "CUSA17416", "CUSA33874", "CUSA37521", "CUSA09929", "CUSA36274", "CUSA05010", "CUSA05996", "CUSA04480", "CUSA09243", "CUSA15938", "CUSA36342", "CUSA10138", "CUSA07708", "CUSA02684", "CUSA02299", "CUSA24103", "CUSA14519", "CUSA24801", "CUSA23978", "CUSA08283", "CUSA13794", "CUSA00083", "CUSA12031", "CUSA24853", "CUSA02754", "CUSA16403", "CUSA18646", "CUSA12771", "CUSA27387", "CUSA00151", "CUSA07098", "CUSA02900", "CUSA07408", "CUSA15716", "CUSA04107", "CUSA05532", "CUSA33838", "CUSA33834", "CUSA48840", "SCUS94221", "CUSA08918", "CUSA33818", "CUSA00382", "CUSA03309", "CUSA05904", "CUSA00462", "CUSA19037", "CUSA01608", "CUSA48223", "CUSA18600", "CUSA05170", "CUSA00220", "CUSA02762", "CUSA40840", "CUSA02629", "SLUS21397", "SLUS20666", "CUSA01799", "CUSA08344", "CUSA15235", "CUSA30423", "CUSA45600", "CUSA23470", "CUSA03167", "CUSA11454", "CUSA03328", "CUSA08336", "CUSA00339", "CUSA08542", "CUSA11302", "CUSA02500", "CUSA01401", "CUSA01764", "CUSA01414", "CUSA05625", "CUSA33151", "CUSA00010", "CUSA05869", "CUSA00092","CUSA01867","CUSA05868","CUSA09920","CUSA10065","CUSA20601","CUSA29547", "CUSA02703", "CUSA03694", "CUSA08960", "CUSA10606", "CUSA11834", "CUSA14971", "CUSA13434", "CUSA11260", "CUSA04841", "CUSA03985", "CUSA03980", "CUSA03642", "CUSA02218", "CUSA01111", "CUSA01047", "CUSA42678", "CUSA32706", "CUSA31951", "CUSA06840", "CUSA03364", "CUSA09660", "CUSA07511", "CUSA10812", "CUSA07340", "CUSA09175", "CUSA16734", "CUSA18201", "CUSA45506", "CUSA29190", "CUSA07399", "CUSA12085", "CUSA32184", "CUSA45894", "CUSA03364", "CUSA47498", "CUSA04126", "CUSA32884", "CUSA16742", "CUSA06460", "CUSA06077", "CUSA04126", "CUSA32884", "CUSA16742", "CUSA06460", "CUSA17425"]
TITLE_IDS = ["CUSA17425"] 

TITLE_IDS = ["CUSA31579", "CUSA42371", "SCUS94221", "SLUS21397"]

OUTPUT_DIR = "ps4_covers"
OUTPUT_DIR2 = "ps4_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR2, exist_ok=True)

FAILED_DOWNLOADS = []  # Lista för att hålla koll på misslyckade nedladdningar

def download_image(url: str, filepath: str):
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    with open(filepath, "wb") as f:
        f.write(response.content)

def get_formtted_id(title_id: str) -> str:
    # Sonys API kräver _00 efter CUSA-koden
    return f"{title_id}_00" if not title_id.endswith("_00") else title_id

def get_covers(title_ids: str):
    for title_id in TITLE_IDS:
        formatted_id = get_formtted_id(title_id)
        print(f"Hämtar data för {title_id}...", end="")

        try:
            # img_url = "https://store.playstation.com/store/api/chihiro/00_09_000/titlecontainer/SE/en/999/CUSA26968_00/image?w=800&h=800"                        
            img_url = f"https://store.playstation.com/store/api/chihiro/00_09_000/titlecontainer/SE/en/999/{formatted_id}/image"
            filename = f"{title_id}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)
            download_image(img_url, filepath)
            print(f"OK")

        except Exception as e:
            print(f"Error") # {e}
            FAILED_DOWNLOADS.append(title_id)

    print(f"\nMisslyckade nedladdningar: {FAILED_DOWNLOADS}\n")

def get_genres(title_ids: str):
    psnawp = PSNAWP(NPSSO_TOKEN)

    for title_id in TITLE_IDS:
        formatted_id = get_formtted_id(title_id)
        print(f"Hämtar data för {title_id}...", end="")

        # search_results = psnawp.search(
        #     search_query="Tunic", 
        #     search_domain=SearchDomain.FULL_GAMES
        # )

        # for item in search_results:
        #     result = item["result"]
        #     print("Namn:", result.get("invariantName"))
        #     print("Title ID:", result.get("titleId"))
        #     print("-" * 30)


        try:
            # Skapa ett GameTitle-objekt för PS4
            game = psnawp.game_title(title_id=formatted_id, platform=PlatformType.PS4)
            details_list = game.get_details()

            if not details_list:
                print(f"  Ingen träff för {title_id}.")
                continue
            
            # with open("details.json", "w", encoding="utf-8") as file:
            #       json.dump(details_list, file, indent=4, ensure_ascii=False)    

            # Loopa igenom returnerade poster och hämta bilderna
            for details in details_list:
                name = details.get("defaultProduct", {}).get("name", "")                
                genres = details.get("defaultProduct", {}).get("genres", [])
                genres_string = ",".join(genres)
                print(f" {name}: {genres_string}")

        except Exception as e:
            print(f" ERROR")
            # print(f"  Fel vid hämtning av {title_id}: {e}")


def get_images(title_ids: str):
    psnawp = PSNAWP(NPSSO_TOKEN)

    for title_id in TITLE_IDS:
        formatted_id = get_formtted_id(title_id)
        print(f"Hämtar data för {title_id}...", end="")
        
        try:
            # Skapa ett GameTitle-objekt för PS4
            game = psnawp.game_title(title_id=formatted_id, platform=PlatformType.PS4)
            details_list = game.get_details()

            if not details_list:
                print(f"  Ingen träff för {title_id}.")
                continue                      

            # Loopa igenom returnerade poster och hämta bilderna
            for details in details_list:
                images = details.get("media", {}).get("images", [])

                if not images:
                    print(f"  Inga bilder hittades i posten för {title_id}.")
                    continue

                for idx, img in enumerate(images):
                    img_url = img.get("url")
                    img_type = img.get("type", f"img_{idx}")
                    if not img_url:
                        continue

                    ext = ".png" if ".png" in img_url.lower() else ".jpg"
                    filename = f"{title_id}_{img_type}{ext}"
                    filepath = os.path.join(OUTPUT_DIR2, filename)

                    download_image(img_url, filepath)
                    print(f"  Sparade: {filename}")

            # print(f"OK")

        except Exception as e:
            # print(f" ERROR")
            print(f"  Fel vid hämtning av {title_id}: {e}")
            FAILED_DOWNLOADS.append(title_id)

    print(f"\nMisslyckade nedladdningar: {FAILED_DOWNLOADS}\n")


def main():
    # get_covers(TITLE_IDS)
    get_images(TITLE_IDS)
    # get_genres(TITLE_IDS)


if __name__ == "__main__":
    main()

