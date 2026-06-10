"""
Generate USNs for all departments in the college
Customize the departments and roll number ranges as needed
"""

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================

# College code and year (e.g., 1GD23 = 2023 admission, GD college code)
COLLEGE_CODE = "1GD23"

# Departments and their max roll numbers
DEPARTMENTS = {
    "CS": 150,  # Computer Science - 150 students
    "EC": 120,  # Electronics - 120 students
    "ME": 90,   # Mechanical - 90 students
    "EE": 60,   # Electrical - 60 students
    "CV": 60,   # Civil - 60 students
    "IS": 120,  # Information Science - 120 students
    "TE": 60,   # Telecommunication - 60 students
    "AI": 60,   # Artificial Intelligence - 60 students
    "BT": 30,   # Biotechnology - 30 students
    "CH": 60,   # Chemical - 60 students
}

# ============================================
# GENERATION LOGIC
# ============================================

def generate_usns():
    """Generate all USNs for all departments"""
    usns = []
    
    print(f"Generating USNs for college: {COLLEGE_CODE}")
    print("=" * 50)
    
    for dept, max_roll in DEPARTMENTS.items():
        dept_usns = []
        for roll in range(1, max_roll + 1):
            usn = f"{COLLEGE_CODE}{dept}{roll:03d}"
            dept_usns.append(usn)
        
        usns.extend(dept_usns)
        print(f"✓ {dept}: Generated {len(dept_usns)} USNs (001-{max_roll:03d})")
    
    print("=" * 50)
    print(f"Total USNs generated: {len(usns)}")
    
    return usns


def save_to_csv(usns, filename="students_all_depts.csv"):
    """Save USNs to CSV file"""
    with open(filename, "w") as f:
        f.write("USN\n")
        for usn in usns:
            f.write(usn + "\n")
    
    print(f"\n✅ Saved to: {filename}")


def main():
    usns = generate_usns()
    
    # Save to a new file first (so you can review before replacing students.csv)
    save_to_csv(usns, "students_all_depts.csv")
    
    print("\n" + "=" * 50)
    print("NEXT STEPS:")
    print("=" * 50)
    print("1. Review 'students_all_depts.csv' to check the USNs")
    print("2. If correct, replace 'students.csv' with this file:")
    print("   copy students_all_depts.csv students.csv")
    print("3. Run the result fetcher to get all department results")
    print("\n⚠️  WARNING: This will fetch results for ALL departments!")
    print("   This may take several hours depending on the number of students.")


if __name__ == "__main__":
    main()
