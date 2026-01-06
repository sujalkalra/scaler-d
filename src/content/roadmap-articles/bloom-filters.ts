import { RoadmapArticle } from "./index"

export const bloomFiltersArticle: RoadmapArticle = {
  slug: "bloom-filters",
  title: "Bloom Filters Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-03-07",
  readTime: 9,
  difficulty: "Advanced",
  category: "Data Structures",
  tags: ["Bloom Filter", "Data Structures", "Probabilistic", "Performance"],
  excerpt: "Master Bloom filters - the space-efficient probabilistic data structure for membership testing.",
  content: `
## Introduction

A **Bloom filter** is a space-efficient probabilistic data structure that tells you whether an element is definitely NOT in a set, or POSSIBLY in it.

---

## How It Works

1. Initialize a bit array of size m (all zeros)
2. Use k hash functions
3. To add: Set bits at all k hash positions
4. To check: If ALL k bits are set, possibly present

\`\`\`python
class BloomFilter:
    def __init__(self, size, num_hashes):
        self.size = size
        self.bits = [0] * size
        self.num_hashes = num_hashes
    
    def add(self, item):
        for i in range(self.num_hashes):
            index = hash(f"{item}{i}") % self.size
            self.bits[index] = 1
    
    def might_contain(self, item):
        for i in range(self.num_hashes):
            index = hash(f"{item}{i}") % self.size
            if self.bits[index] == 0:
                return False  # Definitely not present
        return True  # Possibly present
\`\`\`

---

## Key Properties

- **No false negatives**: If filter says "no", item is definitely not there
- **Possible false positives**: If filter says "yes", item might be there
- **Cannot delete**: Standard Bloom filters don't support deletion
- **Space efficient**: Much smaller than storing actual items

---

## Use Cases

| Use Case | How Bloom Filters Help |
|----------|----------------------|
| Database queries | Skip disk reads for missing keys |
| Web crawlers | Avoid revisiting URLs |
| Spam filtering | Quick check for known spam |
| CDN caching | Check if content might be cached |

---

## Key Takeaways

- Bloom filters trade accuracy for space
- Perfect for "probably yes, definitely no" checks
- Size and hash count affect false positive rate
- Used by databases, caches, and networks
`
}
