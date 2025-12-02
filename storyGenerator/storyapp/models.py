from django.db import models

class Story(models.Model):
    emoji_sequence = models.TextField(blank=True, default='')
    translation = models.TextField()
    author_nickname = models.CharField(max_length=100, blank=True, default='Anonymous')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # show up to the first 10 characters of the emoji sequence to avoid IndexError
        preview = (self.emoji_sequence or '')[:10]
        return f"{self.author_nickname}: {preview}"