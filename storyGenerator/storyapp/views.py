from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Story
from .serializer import StorySerializer
from .translation import translate_emoji_sequence as translate_emojis

@api_view(['GET'])
def stories_list(request):
    qs = Story.objects.all().order_by('-likes', '-created_at')
    serializer = StorySerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def stories_create(request):
    """
    Expected JSON:
    {
      "emoji_sequence": ["🐱","🐟"],
      "author_nickname": "Oshani"
    }
    """
    data = request.data
    seq = data.get('emoji_sequence') or data.get('emoji') or []
    if isinstance(seq, str):
        seq = seq.strip().split()
    if not isinstance(seq, list) or len(seq) == 0:
        return Response({"error":"emoji_sequence must be a non-empty list"}, status=status.HTTP_400_BAD_REQUEST)

    author = data.get('author_nickname','Anonymous')
    translation = translate_emojis(seq, author=author)

    story = Story.objects.create(
        emoji_sequence=' '.join(seq),
        translation=translation,
        author_nickname=author
    )
    serializer = StorySerializer(story)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def translate_preview(request):
    seq = request.data.get('emoji_sequence') or request.data.get('emoji') or []
    if isinstance(seq, str):
        seq = seq.strip().split()
    if not isinstance(seq, list):
        return Response({"translation": "I couldn't read that."})
    author = request.data.get('author_nickname','Someone')
    translation = translate_emojis(seq, author=author)
    return Response({"translation": translation})

@api_view(['POST'])
def like_story(request, id):
    story = get_object_or_404(Story, id=id)
    story.likes += 1
    story.save()
    return Response({"likes": story.likes})
