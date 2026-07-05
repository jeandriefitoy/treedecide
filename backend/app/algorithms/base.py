from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class TreeNode:
    name: str
    attribute: str | None = None
    children: list["TreeNode"] = field(default_factory=list)
    is_leaf: bool = False
    class_label: str | None = None

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "attribute": self.attribute,
            "is_leaf": self.is_leaf,
            "class_label": self.class_label,
            "children": [c.to_dict() for c in self.children] if self.children else None,
        }


class DecisionTreeAlgorithm(ABC):
    @abstractmethod
    def fit(self, data: list[dict], target: str, features: list[str]) -> TreeNode:
        pass

    @abstractmethod
    def extract_rules(self, tree: TreeNode) -> list[str]:
        pass
