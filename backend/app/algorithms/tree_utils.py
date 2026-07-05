from app.algorithms.base import TreeNode


def tree_to_dict(node: TreeNode) -> dict:
    return node.to_dict()


def compute_accuracy(predictions: list, actual: list) -> float:
    if not predictions:
        return 0.0
    correct = sum(1 for p, a in zip(predictions, actual) if p == a)
    return correct / len(predictions)
