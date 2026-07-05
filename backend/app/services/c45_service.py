import pandas as pd
import numpy as np
import math
from typing import Dict, Any, List, Union, Tuple

def calculate_entropy(target_column: pd.Series) -> float:
    """Hitung Entropy dari sekumpulan target."""
    counts = target_column.value_counts()
    total = len(target_column)
    entropy = 0.0
    for count in counts:
        prob = count / total
        entropy -= prob * math.log2(prob)
    return entropy

def calculate_split_info(df: pd.Series) -> float:
    """Hitung Split Information (denominator untuk Gain Ratio)."""
    counts = df.value_counts()
    total = len(df)
    split_info = 0.0
    for count in counts:
        prob = count / total
        split_info -= prob * math.log2(prob)
    return split_info

def evaluate_categorical_attribute(df: pd.DataFrame, attribute: str, target: str, base_entropy: float) -> Tuple[float, Any]:
    """Hitung Gain Ratio untuk atribut kategorik."""
    total_rows = len(df)
    weighted_entropy = 0.0
    
    for value in df[attribute].unique():
        subset = df[df[attribute] == value]
        prob = len(subset) / total_rows
        weighted_entropy += prob * calculate_entropy(subset[target])
        
    info_gain = base_entropy - weighted_entropy
    split_info = calculate_split_info(df[attribute])
    
    # Hindari pembagian dengan nol
    gain_ratio = info_gain / split_info if split_info > 0 else 0
    return gain_ratio, None  # None karena tidak ada threshold untuk kategorik

def evaluate_numeric_attribute(df: pd.DataFrame, attribute: str, target: str, base_entropy: float) -> Tuple[float, float]:
    """
    Hitung Gain Ratio terbaik untuk atribut numerik dengan mencari threshold optimal.
    """
    # Urutkan dataframe berdasarkan atribut numerik
    sorted_df = df.sort_values(by=attribute).reset_index(drop=True)
    unique_vals = sorted_df[attribute].unique()
    
    best_gain_ratio = -1.0
    best_threshold = None
    
    # Coba titik tengah antara nilai-nilai unik yang berurutan sebagai kandidat threshold
    for i in range(len(unique_vals) - 1):
        threshold = (unique_vals[i] + unique_vals[i+1]) / 2.0
        
        # Split data menjadi <= threshold dan > threshold
        subset_leq = sorted_df[sorted_df[attribute] <= threshold]
        subset_gt = sorted_df[sorted_df[attribute] > threshold]
        
        prob_leq = len(subset_leq) / len(df)
        prob_gt = len(subset_gt) / len(df)
        
        weighted_entropy = (prob_leq * calculate_entropy(subset_leq[target])) + \
                           (prob_gt * calculate_entropy(subset_gt[target]))
                           
        info_gain = base_entropy - weighted_entropy
        
        # Hitung pseudo split info untuk binary split (leq vs gt)
        split_info = 0.0
        if prob_leq > 0: split_info -= prob_leq * math.log2(prob_leq)
        if prob_gt > 0:  split_info -= prob_gt * math.log2(prob_gt)
        
        gain_ratio = info_gain / split_info if split_info > 0 else 0
        
        if gain_ratio > best_gain_ratio:
            best_gain_ratio = gain_ratio
            best_threshold = threshold
            
    return best_gain_ratio, best_threshold

def build_c45_tree(df: pd.DataFrame, target: str, attributes: List[str], columns_info: List[Dict]) -> Union[str, Dict]:
    # Base cases
    if len(df[target].unique()) == 1:
        return df[target].iloc[0]
    if not attributes:
        return df[target].mode()[0]
        
    base_entropy = calculate_entropy(df[target])
    best_attr = None
    best_gain_ratio = -1.0
    best_threshold = None
    
    # Evaluasi semua atribut tersisa
    for attr in attributes:
        # Cek tipe atribut dari columns_info
        attr_info = next((item for item in columns_info if item["name"] == attr), None)
        is_numeric = attr_info["type"] == "numeric" if attr_info else False
        
        if is_numeric:
            gain_ratio, threshold = evaluate_numeric_attribute(df, attr, target, base_entropy)
        else:
            gain_ratio, threshold = evaluate_categorical_attribute(df, attr, target, base_entropy)
            
        if gain_ratio > best_gain_ratio:
            best_gain_ratio = gain_ratio
            best_attr = attr
            best_threshold = threshold
            
    if best_attr is None:
        return df[target].mode()[0]
        
    tree = {best_attr: {}}
    attr_info = next((item for item in columns_info if item["name"] == best_attr), None)
    is_numeric = attr_info["type"] == "numeric" if attr_info else False
    
    # Proses Splitting berdasarkan tipe
    if is_numeric:
        # Numeric Split (Binary: <= threshold dan > threshold)
        subset_leq = df[df[best_attr] <= best_threshold]
        subset_gt = df[df[best_attr] > best_threshold]
        
        label_leq = f"<= {best_threshold:.2f}"
        label_gt = f"> {best_threshold:.2f}"
        
        tree[best_attr][label_leq] = build_c45_tree(subset_leq, target, attributes, columns_info) if not subset_leq.empty else df[target].mode()[0]
        tree[best_attr][label_gt] = build_c45_tree(subset_gt, target, attributes, columns_info) if not subset_gt.empty else df[target].mode()[0]
    else:
        # Categorical Split (Multi-way)
        remaining_attrs = [a for a in attributes if a != best_attr]
        for value in df[best_attr].unique():
            subset = df[df[best_attr] == value]
            tree[best_attr][value] = build_c45_tree(subset, target, remaining_attrs, columns_info) if not subset.empty else df[target].mode()[0]
            
    return tree

def extract_c45_rules(tree: Union[str, Dict], current_rule: str = "") -> List[str]:
    rules = []
    if not isinstance(tree, dict):
        return [f"IF {current_rule} THEN {tree}"]
        
    for root_node, branches in tree.items():
        for branch_value, subtree in branches.items():
            # Cek apakah branch_value adalah operator numerik (<= atau >)
            if str(branch_value).startswith("<=") or str(branch_value).startswith(">"):
                condition = f"{root_node} {branch_value}"
            else:
                condition = f"{root_node} = '{branch_value}'"
                
            new_rule = f"{current_rule} AND {condition}" if current_rule else condition
            rules.extend(extract_c45_rules(subtree, new_rule))
            
    return rules

def run_c45_training(df: pd.DataFrame, target_column: str, columns_info: List[Dict]) -> Dict[str, Any]:
    # Handle Missing Values secara sederhana (imputasi mode untuk semua)
    df = df.copy()
    for col in df.columns:
        if df[col].isnull().any():
            mode_val = df[col].mode()[0]
            df[col] = df[col].fillna(mode_val)
            
    feature_columns = [col for col in df.columns if col != target_column]
    tree = build_c45_tree(df, target_column, feature_columns, columns_info)
    rules = extract_c45_rules(tree)
    
    return {
        "algorithm": "C4.5",
        "tree": tree,
        "rules": rules,
        "message": "Model berhasil dilatih menggunakan algoritma C4.5."
    }