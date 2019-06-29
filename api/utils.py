from datetime import date

def calculateAge(birthDate): 
    today = date.today() 
    age = today.year - birthDate.year - ((today.month, today.day) < (birthDate.month, birthDate.day)) 
  
    return age

def date_to_age(date_str):
    bdate = date_str.split('/')
    try:
        day, month, year = int(bdate[0]), int(bdate[1]), int(bdate[2])
        bdate = date(year, month, day)
        age = calculateAge(bdate)
    except:
        age = 'Unknown'

    return age