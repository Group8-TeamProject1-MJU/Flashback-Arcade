using System;
using System.Collections.Generic;

public class TrieChat
{
    class TrieNode
    {
        public Dictionary<char, TrieNode> Children = new Dictionary<char, TrieNode>();
        public bool IsEndOfWord = false;
    }

    private TrieNode root;


    public TrieChat()
    {
        root = new TrieNode();
        AddWord("18년");
        AddWord("18놈");
        AddWord("18새끼");
        AddWord("개새");
        AddWord("개세");
        AddWord("개넘");
        AddWord("개세끼");
        AddWord("개새끼");
        AddWord("개쓰래기");
        AddWord("개쓰레기");
        AddWord("개씨블");
        AddWord("개씨발");
        AddWord("개자식");
        AddWord("니미");
        AddWord("미친새끼");
        AddWord("미친놈");
        AddWord("미친년");
        AddWord("씨발");
        AddWord("니애비");
        AddWord("니애미");
        AddWord("병신");
        AddWord("븅신");
        AddWord("시발년");
        AddWord("시발놈");
        AddWord("시발새끼");
        AddWord("시팔");
        AddWord("ㅆㅂ");
        AddWord("ㅅㅂ");
        AddWord("ㅄ");
        AddWord("ㅂㅅ");
        AddWord("존나");
        AddWord("족같내");
        AddWord("좃까");
        AddWord("존나게");
        AddWord("염병");
        AddWord("존염병할");
        AddWord("씹창");
        AddWord("씹팔");
        AddWord("씹년");
        AddWord("썅년");
        AddWord("썅년");
        AddWord("쌍놈");
        AddWord("쌔끼");
        AddWord("새끼");
        AddWord("시발");
    }

    // 단어 추가
    private void AddWord(string word)
    {
        TrieNode node = root;
        foreach (char ch in word)
        {
            if (!node.Children.ContainsKey(ch))
            {
                node.Children.Add(ch, new TrieNode());
            }

            node = node.Children[ch];
        }

        node.IsEndOfWord = true;
    }

    // 채팅 필터링
    public bool FilterChat(string message)
    {
        TrieNode node;

        for (int i = 0; i < message.Length; i++)
        {
            node = root;
            int j = i;

            while (j < message.Length && node.Children.ContainsKey(message[j]))
            {
                node = node.Children[message[j]];
                j++;

                if (node.IsEndOfWord)
                {
                    return true; // 필터링된 단어 발견
                }
            }
        }

        return false; // 필터링된 단어 없음
    }
}