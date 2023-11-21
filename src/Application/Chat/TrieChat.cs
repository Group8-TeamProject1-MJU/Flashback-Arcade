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
        AddWord("abcde");
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