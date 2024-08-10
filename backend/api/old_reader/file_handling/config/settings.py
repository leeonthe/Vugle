import configparser
import os

def config(section, filename=os.path.join(os.path.dirname(__file__), 'config.ini')):
    parser = configparser.ConfigParser()
    parser.read(filename)

    params = {}
    if parser.has_section(section):
        items = parser.items(section)
        for item in items:
            params[item[0]] = item[1]
    else:
        raise Exception(f'Section {section} not found in the {filename} file.')

    return params
