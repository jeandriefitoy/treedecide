import pandas as pd
import math
from typing import Dict, Any, List, Union

def calculate_entropy(target_column: pd.Series) -> float:
    """
    Menghitung nilai Entropy dari sebuah sekumpulan data target.
    Rumus: E(S) = sum(-p * log2(p))
    """
    # Hitung jumlah kemunculan setiap kelas/label unik
    counts = target_column.value_counts()
    total = len(target_column)
    entropy = 0.0
    
    for count in counts:
        prob = count / total
        entropy -= prob * math.log2(prob)
        
    return entropy

def calculate_information_gain(df: pd.DataFrame, attribute: str, target_column_name: str) -> float:
    """
    Menghitung Information Gain dari sebuah atribut tertentu.
    Rumus: Gain(S, A) = Entropy(S) - sum(|Sv|/|S| * Entropy(Sv))
    """
    # 1. Hitung entropy total (Entropy(S)) dari dataset saat ini
    total_entropy = calculate_entropy(df[target_column_name])
    
    # 2. Hitung weighted entropy dari atribut yang sedang dievaluasi
    values = df[attribute].value_counts()
    total_rows = len(df)
    weighted_entropy = 0.0
    
    for value, count in values.items():
        # Ambil subset data dimana nilai atribut == value
        subset = df[df[attribute] == value]
        # Hitung entropy dari subset tersebut
        subset_entropy = calculate_entropy(subset[target_column_name])
        # Tambahkan ke weighted entropy
        weighted_entropy += (count / total_rows) * subset_entropy
        
    # 3. Information Gain = Total Entropy - Weighted Entropy
    return total_entropy - weighted_entropy

def build_id3_tree(
    df: pd.DataFrame,
    target_column_name: str,
    attributes: List[str],
    depth: int = 0,
    max_depth: int = 8,
    min_samples_split: int = 5,
    min_gain: float = 0.01,
) -> Union[str, Dict]:
    """
    Membangun pohon keputusan ID3 secara rekursif.
    """
    # Base Case 1: Jika semua data memiliki label target yang sama (pure node)
    if len(df[target_column_name].unique()) == 1:
        return df[target_column_name].iloc[0]
        
    # Base Case 2: Jika tidak ada atribut tersisa untuk di-split, 
    # kembalikan label target yang paling sering muncul (majority class)
    if not attributes:
        return df[target_column_name].mode()[0]
    
    # Base Case 3: Batasi kedalaman pohon
    if depth >= max_depth:
        return df[target_column_name].mode()[0]
    
    # jumlah data terlalu sedikit
    if len(df) < min_samples_split:
        return df[target_column_name].mode()[0]
        
    # Recursive Step: Cari atribut dengan Information Gain tertinggi
    gains = {}
    for attr in attributes:
        gains[attr] = calculate_information_gain(df, attr, target_column_name)
        
    # Ambil nama atribut dengan nilai gain maksimal
    best_attr = max(gains, key=gains.get)
    
    best_gain = gains[best_attr]

    if best_gain < min_gain:
        return df[target_column_name].mode()[0]
    
    # Inisialisasi node root untuk subtree ini
    tree = {best_attr: {}}
    
    # Hapus atribut terbaik dari daftar atribut yang tersedia untuk level selanjutnya
    remaining_attributes = [attr for attr in attributes if attr != best_attr]
    
    # Split data berdasarkan nilai unik dari atribut terbaik
    for value in df[best_attr].unique():
        subset = df[df[best_attr] == value]
        
        if subset.empty:
            # Jika subset kosong (jarang terjadi di pandas, tapi sbg pengaman), kembalikan majority class
            tree[best_attr][value] = df[target_column_name].mode()[0]
        else:
            tree[best_attr][value] = build_id3_tree(
                subset,
                target_column_name,
                remaining_attributes,
                depth + 1,
                max_depth,
                min_samples_split,
                min_gain,
            )
            
    return tree

def extract_rules(tree: Union[str, Dict], current_rule: str = "") -> List[str]:
    """
    Mengekstrak aturan IF-THEN dari dictionary tree yang terbentuk.
    Contoh output: "IF Cuaca == 'Cerah' AND Kelembaban == 'Tinggi' THEN Tidak"
    """
    rules = []
    
    # Base case: jika tree bukan dictionary, berarti sudah mencapai leaf (target)
    if not isinstance(tree, dict):
        return [f"IF {current_rule} THEN {tree}"]
        
    # Traverse dictionary tree
    for root_node, branches in tree.items():
        for branch_value, subtree in branches.items():
            # Format kondisi untuk cabang ini
            condition = f"{root_node} = '{branch_value}'"
            
            # Gabungkan dengan aturan dari parent node jika ada (AND)
            new_rule = f"{current_rule} AND {condition}" if current_rule else condition
            
            # Rekursif ke bawah
            rules.extend(extract_rules(subtree, new_rule))
            
    return rules

def run_id3_training(df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
    """
    Fungsi utama (orchestrator) yang dipanggil oleh endpoint backend.
    """
    # Validasi apakah kolom target ada di dataframe
    if target_column not in df.columns:
        raise ValueError(f"Kolom target '{target_column}' tidak ditemukan di dataset.")
        
    feature_columns = [col for col in df.columns if col != target_column]
    
    # 1. Bangun pohon keputusan
    tree = build_id3_tree(
        df,
        target_column,
        feature_columns,
        max_depth=8,
        min_samples_split=5,
        min_gain=0.01,
    )
    
    rules = extract_rules(tree)
    
    return {
        "algorithm": "ID3",
        "tree": tree,
        "rules": rules,
        "message": "Model berhasil dilatih menggunakan algoritma ID3."
    }