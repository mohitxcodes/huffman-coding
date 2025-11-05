// huffman.cpp
// Compile: g++ -std=c++17 -O2 -o huffman huffman.cpp
// Usage:
//   Compress:   ./huffman c inputfile output.hf
//   Decompress: ./huffman d input.hf outputfile
#include <iostream>
#include <string>
#include <vector>
#include <queue>
#include <array>
#include <fstream>
#include <unordered_map>
#include <bitset>
using namespace std;
using ull = unsigned long long;

struct Node
{
    int symbol; // 0..255 for leaf, -1 for internal
    ull freq;
    Node *left, *right;
    Node(int s, ull f) : symbol(s), freq(f), left(nullptr), right(nullptr) {}
    Node(Node *l, Node *r) : symbol(-1), freq(l->freq + r->freq), left(l), right(r) {}
};

struct Cmp
{
    bool operator()(const Node *a, const Node *b) const
    {
        if (a->freq == b->freq)
            return a->symbol > b->symbol;
        return a->freq > b->freq;
    }
};

void freeTree(Node *root)
{
    if (!root)
        return;
    freeTree(root->left);
    freeTree(root->right);
    delete root;
}

// build codes recursively
void buildCodes(Node *root, array<string, 256> &codes, string &tmp)
{
    if (!root)
        return;
    if (root->left == nullptr && root->right == nullptr)
    {
        if (tmp.empty())
            tmp = "0"; // for single symbol
        codes[root->symbol] = tmp;
        return;
    }
    tmp.push_back('0');
    buildCodes(root->left, codes, tmp);
    tmp.pop_back();
    tmp.push_back('1');
    buildCodes(root->right, codes, tmp);
    tmp.pop_back();
}

void write_uint16(ofstream &out, uint16_t v)
{
    out.write(reinterpret_cast<const char *>(&v), sizeof(v));
}
void write_uint64(ofstream &out, uint64_t v)
{
    out.write(reinterpret_cast<const char *>(&v), sizeof(v));
}
uint16_t read_uint16(ifstream &in)
{
    uint16_t v;
    in.read(reinterpret_cast<char *>(&v), sizeof(v));
    return v;
}
uint64_t read_uint64(ifstream &in)
{
    uint64_t v;
    in.read(reinterpret_cast<char *>(&v), sizeof(v));
    return v;
}

// ===================== COMPRESS =====================
int compressFile(const string &inPath, const string &outPath)
{
    // read file
    array<uint64_t, 256> freq{};
    ifstream in(inPath, ios::binary);
    if (!in)
    {
        cerr << "Cannot open input file: " << inPath << "\n";
        return 1;
    }

    in.seekg(0, ios::end);
    size_t filesize = in.tellg();
    in.seekg(0, ios::beg);

    vector<unsigned char> data(filesize);
    in.read(reinterpret_cast<char *>(data.data()), data.size());
    in.close();

    for (unsigned char b : data)
        freq[b]++;

    // build Huffman tree
    priority_queue<Node *, vector<Node *>, Cmp> pq;
    for (int b = 0; b < 256; ++b)
        if (freq[b] > 0)
            pq.push(new Node(b, freq[b]));

    if (pq.empty())
    {
        ofstream out(outPath, ios::binary);
        out.write("HFM1", 4);
        write_uint16(out, 0);
        write_uint64(out, 0);
        out.close();
        return 0;
    }

    while (pq.size() > 1)
    {
        Node *a = pq.top();
        pq.pop();
        Node *b = pq.top();
        pq.pop();
        pq.push(new Node(a, b));
    }
    Node *root = pq.top();

    // build codes
    array<string, 256> codes;
    for (auto &s : codes)
        s.clear();
    string tmp;
    buildCodes(root, codes, tmp);

    // write header
    ofstream out(outPath, ios::binary);
    if (!out)
    {
        cerr << "Cannot open output: " << outPath << "\n";
        freeTree(root);
        return 1;
    }

    out.write("HFM1", 4);
    uint16_t distinct = 0;
    for (int i = 0; i < 256; ++i)
        if (freq[i] > 0)
            distinct++;
    write_uint16(out, distinct);

    for (int i = 0; i < 256; ++i)
    {
        if (freq[i] > 0)
        {
            uint8_t sym = static_cast<uint8_t>(i);
            out.write(reinterpret_cast<const char *>(&sym), 1);
            write_uint64(out, freq[i]);
        }
    }

    uint64_t totalBits = 0;
    for (unsigned char b : data)
        totalBits += codes[b].size();
    write_uint64(out, totalBits);

    // encode bits
    uint8_t outByte = 0;
    int bitCount = 0;

    for (unsigned char b : data)
    {
        const string &code = codes[b];
        for (char c : code)
        {
            outByte <<= 1;
            if (c == '1')
                outByte |= 1;
            bitCount++;
            if (bitCount == 8)
            {
                out.put(static_cast<char>(outByte));
                outByte = 0;
                bitCount = 0;
            }
        }
    }
    if (bitCount > 0)
    {
        outByte <<= (8 - bitCount);
        out.put(static_cast<char>(outByte));
    }

    out.flush();
    auto out_size = out.tellp(); // ✅ fixed: get size before closing
    out.close();
    freeTree(root);

    double ratio = 0;
    if (filesize > 0)
        ratio = (double)out_size / (double)filesize * 100.0;

    cout << fixed << setprecision(2);
    cout << "Compressed " << inPath << " -> " << outPath << "\n";
    cout << "Original: " << filesize << " bytes\n";
    cout << "Compressed: " << out_size << " bytes\n";
    cout << "Compression ratio: " << ratio << "%\n";

    return 0;
}

// ===================== DECOMPRESS =====================
int decompressFile(const string &inPath, const string &outPath)
{
    ifstream in(inPath, ios::binary);
    if (!in)
    {
        cerr << "Cannot open input: " << inPath << "\n";
        return 1;
    }

    char magic[4];
    in.read(magic, 4);
    if (!in || strncmp(magic, "HFM1", 4) != 0)
    {
        cerr << "Not a valid Huffman file\n";
        return 1;
    }

    uint16_t distinct = read_uint16(in);
    array<uint64_t, 256> freq{};
    for (int i = 0; i < distinct; ++i)
    {
        uint8_t sym;
        in.read(reinterpret_cast<char *>(&sym), 1);
        freq[sym] = read_uint64(in);
    }
    uint64_t totalBits = read_uint64(in);

    if (distinct == 0 || totalBits == 0)
    {
        ofstream out(outPath, ios::binary);
        out.close();
        return 0;
    }

    // rebuild tree
    priority_queue<Node *, vector<Node *>, Cmp> pq;
    for (int b = 0; b < 256; ++b)
        if (freq[b] > 0)
            pq.push(new Node(b, freq[b]));

    while (pq.size() > 1)
    {
        Node *a = pq.top();
        pq.pop();
        Node *b = pq.top();
        pq.pop();
        pq.push(new Node(a, b));
    }
    Node *root = pq.top();

    ofstream out(outPath, ios::binary);
    if (!out)
    {
        cerr << "Cannot open output file: " << outPath << "\n";
        freeTree(root);
        return 1;
    }

    Node *curr = root;
    uint64_t bitsRead = 0;

    while (bitsRead < totalBits && in.good())
    {
        char ch;
        in.get(ch);
        if (!in)
            break;
        uint8_t byte = static_cast<uint8_t>(ch);
        for (int i = 7; i >= 0 && bitsRead < totalBits; --i)
        {
            int bit = (byte >> i) & 1;
            curr = bit ? curr->right : curr->left;
            if (curr->left == nullptr && curr->right == nullptr)
            {
                out.put(static_cast<char>(curr->symbol));
                curr = root;
            }
            bitsRead++;
        }
    }

    out.close();
    freeTree(root);
    return 0;
}

// ===================== MAIN =====================
int main(int argc, char **argv)
{
    if (argc != 4)
    {
        cerr << "Usage:\n"
             << "  Compress:   " << argv[0] << " c inputfile output.hf\n"
             << "  Decompress: " << argv[0] << " d input.hf outputfile\n";
        return 1;
    }

    string mode = argv[1];
    if (mode == "c")
        return compressFile(argv[2], argv[3]);
    if (mode == "d")
        return decompressFile(argv[2], argv[3]);

    cerr << "Unknown mode: " << mode << "\n";
    return 1;
}