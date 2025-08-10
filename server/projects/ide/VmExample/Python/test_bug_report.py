#!/usr/bin/env python3
"""
Test script for the bug report feature.
This script helps test the bug report submission system.
"""

print("Bug Report Test Script")
print("=" * 50)
print()

# Simulate different types of bugs

def test_division_by_zero():
    """Test division by zero error"""
    print("Testing division by zero...")
    try:
        result = 10 / 0
    except ZeroDivisionError as e:
        print(f"✓ Caught expected error: {e}")
        print("  This type of error should be reported through the bug report system")

def test_index_error():
    """Test index out of range error"""
    print("\nTesting index out of range...")
    try:
        my_list = [1, 2, 3]
        item = my_list[10]
    except IndexError as e:
        print(f"✓ Caught expected error: {e}")
        print("  This type of error should be reported through the bug report system")

def test_type_error():
    """Test type error"""
    print("\nTesting type error...")
    try:
        result = "string" + 123
    except TypeError as e:
        print(f"✓ Caught expected error: {e}")
        print("  This type of error should be reported through the bug report system")

def test_input_handling():
    """Test input handling"""
    print("\nTesting user input (you can skip with Enter)...")
    try:
        user_input = input("Enter any text to test input: ")
        if user_input:
            print(f"You entered: {user_input}")
        else:
            print("No input provided")
    except Exception as e:
        print(f"Error handling input: {e}")

# Run all tests
print("Running bug report test scenarios:")
print("-" * 50)

test_division_by_zero()
test_index_error()
test_type_error()
test_input_handling()

print("\n" + "=" * 50)
print("Test completed!")
print()
print("To report any bugs you encounter:")
print("1. Click the bug report icon (⚠) in the top-right corner")
print("2. Fill in the bug report form with details")
print("3. Submit the report to receive a ticket ID")
print("=" * 50)