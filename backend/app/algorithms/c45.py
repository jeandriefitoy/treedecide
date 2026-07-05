"""
Implementasi manual algoritma C4.5.

TODO: Implementasi lengkap gain ratio, penanganan atribut numerik
(threshold split), dan missing value handling sesuai materi presentasi.
"""

from collections import Counter

from app.algorithms.base import DecisionTreeAlgorithm, TreeNode


class C45Algorithm(DecisionTreeAlgorithm):
    def fit(self, data: list[dict], target: str, features: list[str]) -> TreeNode:
        return self._build_tree(data, target, features)

    def _build_tree(
        self, data: list[dict], target: str, features: list[str]
    ) -> TreeNode:
        labels = [row[target] for row in data]
        label_counts = Counter(labels)

        if len(label_counts) == 1:
            return TreeNode(
                name=str(labels[0]),
                is_leaf=True,
                class_label=str(labels[0]),
            )

        if not features:
            majority = label_counts.most_common(1)[0][0]
            return TreeNode(
                name=str(majority),
                is_leaf=True,
                class_label=str(majority),
            )

        best_feature = features[0]
        node = TreeNode(name=best_feature, attribute=best_feature)

        values = sorted(set(str(row[best_feature]) for row in data))
        for value in values:
            subset = [row for row in data if str(row[best_feature]) == value]
            remaining = [f for f in features if f != best_feature]
            child = self._build_tree(subset, target, remaining)
            child.name = f"{best_feature} = {value}"
            node.children.append(child)

        return node

    def extract_rules(self, tree: TreeNode, prefix: str = "") -> list[str]:
        if tree.is_leaf:
            return [f"IF {prefix} THEN class = {tree.class_label}"]

        rules = []
        for child in tree.children:
            condition = child.name
            new_prefix = f"{prefix} AND {condition}" if prefix else condition
            rules.extend(self.extract_rules(child, new_prefix))
        return rules
