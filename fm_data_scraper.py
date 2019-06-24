import numpy as np
# from nltk.corpus import stopwords
import requests
from bs4 import BeautifulSoup as bs

url = 'https://fmdataba.com/19/p/1165/lionel-messi/'

r = requests.get(url, headers = {'User-Agent':'Mozilla/5.0'})
soup = bs(r.content, 'lxml')
abilities = ['TECHNICAL', 'MENTAL' , 'PHYSICAL']

def get_abilities(soup, keyword):
    table = soup.select_one('div:has(h3:contains("' + ability + '")) + div > table')
    d = {item.select_one('td:nth-child(odd)').text: int(item.select_one('td:nth-child(even)').text) for item in table.select('tr')}
    return d

results = {}

for ability in abilities:
    results[ability] = get_abilities(soup, ability)

print(results)