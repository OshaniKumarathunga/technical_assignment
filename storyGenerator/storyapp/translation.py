import random

PATTERNS = [
    {
        'pattern': ['🏃', '🌧️'],
        'templates': [
            '{author} ran from the rain',
            'Quick dash through the storm'
   ]
 },
    {
        'pattern': ['🐱', '🐟'],
        'templates': [
            'The cat spotted its favorite meal',
            'Feline fishing adventures'
   ]
 }
]

DEFAULT_TEMPLATES = [
    'An unexpected journey',
    'A day full of surprises',]

def translate_emoji_sequence(sequence, author_nickname=None):
    seq_set = set(sequence)
    for rule in PATTERNS:
        if all (p in seq_set for p in rule['pattern']):
            template = random.choice(rule['templates']).replace('{author}', author_nickname or "Someone")
            return template
    if len(sequence) >= 2:
        return f"{author_nickname} saw {''.join(sequence[:2])} and imagined a short tale."
    return random.choice (DEFAULT_TEMPLATES)
            