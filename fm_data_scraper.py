import numpy as np
import requests
from bs4 import BeautifulSoup as bs

def scrape_player_info(url):
    r = requests.get(url, headers = {'User-Agent':'Mozilla/5.0'})
    soup = bs(r.content, 'html.parser')
    abilities = ['TECHNICAL', 'GOALKEEPING', 'MENTAL', 'PHYSICAL']

    def get_abilities(soup, keyword):
        table = soup.select_one('div:has(h3:contains("' + keyword + '")) ~ div > table')
        if table:
            d = {item.select_one('td:nth-child(odd)').text:item.select_one('td:nth-child(even)').text for item in table.select('tr')}
            return d

    results = {}
    for ability in abilities:
        stats = get_abilities(soup, ability)
        results[ability] = stats if stats else {}
    
    return results