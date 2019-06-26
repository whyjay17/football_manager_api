from bs4 import BeautifulSoup as bs
import pandas as pd
import numpy as np
import requests


def get_abilities(url, is_gk = False):
    """Gets player's abilitiy stats based on the URL link given

    Parameters
    ----------
    url : str
        The URL of the player data e.g. 'https://fmdataba.com/19/p/1165/lionel-messi/'
    is_gk : bool, optional
        A flag used to indicate whether the player is a goalkeeper or not (default is False)

    Returns
    -------
    dict[dict]
        a dict of dicts that contains the player ability  stats
    """

    page = requests.get(url, headers={'User-Agent':'Mozilla/5.0'})
    tables = pd.read_html(page.text)
    abilities = {}
    first_col = (2, 'technical')
    if is_gk:
        first_col = (2, 'goalkeeping')
    for idx, name in [first_col, (3, 'mental'), (4, 'physical')]:
        tbl = tables[idx]
        data = {r[0]: r[1] for _, r in tbl.iterrows()}
        abilities[name] = data

    return abilities


def get_profile_data(url):
    """Gets player's profile information based on the URL link given

    Parameters
    ----------
    url : str
        The URL of the player data e.g. 'https://fmdataba.com/19/p/1165/lionel-messi/'

    Returns
    -------
    dict
        a dict that contains the player profile information (name, nationality, birth date, position, and preferred foot)
    """

    profile_data = {}
    page = requests.get(url, headers={'User-Agent':'Mozilla/5.0'})
    soup = bs(page.content, 'html.parser')
    rows = soup.find("table").find("tbody").find_all("tr")[0]
    print(pd.read_html(page.text))
    tables = pd.read_html(page.text)[0]
    print(tables)
    idx = tables[1][12].index('Main')
    img_meta = rows.findAll('img')[0]
    idx2 = img_meta['alt'].index('FM')
    profile_data['profile_img'] = img_meta['src']
    profile_data['name'] = img_meta['alt'][:idx2]
    profile_data['birth_date'] = tables[1][8].split(' ')[0].strip('()')
    profile_data['nation'] = tables[1][12][:idx]
    profile_data['position'] = tables[1][21]
    profile_data['foot'] = tables[1][19]

    return profile_data