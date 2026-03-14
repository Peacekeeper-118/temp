import re

# ─── Onboarding.tsx ───────────────────────────────────────────────────────────

with open(r'components\Onboarding.tsx', 'r', encoding='utf-8') as f:
    ob = f.read()

def insert_before_value(content, value_attr, new_attrs_list):
    """Find 'value_attr' in an <input ... /> block and prepend new_attrs_list lines before it."""
    # Find the value= line, capture its leading whitespace
    pattern = re.compile(r'([ \t]+)(' + re.escape(value_attr) + r')')
    m = pattern.search(content)
    if not m:
        print(f"WARNING: could not find: {value_attr}")
        return content
    indent = m.group(1)
    insertion = ''.join(indent + attr + '\n' for attr in new_attrs_list)
    # Replace ONLY the first occurrence
    return content[:m.start()] + insertion + content[m.start():]

def add_htmlfor_to_label(content, label_text, htmlfor_value):
    """Add htmlFor="..." to a <label ...> tag that contains label_text."""
    # Match the label opening tag without htmlFor
    pattern = re.compile(r'(<label )(?!.*htmlFor)(className="[^"]*">)(' + re.escape(label_text) + r'</label>)')
    replacement = r'\1htmlFor="' + htmlfor_value + r'" \2\3'
    new_content, n = pattern.subn(replacement, content, count=1)
    if n == 0:
        print(f"WARNING: could not find label for: {label_text}")
    return new_content

# 1. Mobile input — add before value={address.mobile} that is followed by handleAddressChange('mobile'
#    Use a tighter pattern since there might be multiple address.mobile references
def insert_before_value_with_context(content, value_attr, context_after, new_attrs_list):
    """Insert new_attrs_list before value_attr line, only when context_after appears shortly after."""
    lines = content.split('\n')
    result = []
    i = 0
    inserted = False
    while i < len(lines):
        line = lines[i]
        stripped = line.lstrip()
        indent = line[:len(line) - len(stripped)]
        if not inserted and stripped == value_attr:
            # Check the next few lines for context
            lookahead = '\n'.join(lines[i:i+4])
            if context_after in lookahead:
                for attr in new_attrs_list:
                    result.append(indent + attr)
                inserted = True
        result.append(line)
        i += 1
    if not inserted:
        print(f"WARNING: could not find value attr '{value_attr}' with context '{context_after}'")
    return '\n'.join(result)

# Mobile input
ob = insert_before_value_with_context(
    ob,
    "value={address.mobile}",
    "handleAddressChange('mobile'",
    ['id="onboarding-mobile"', 'name="mobile"', 'autoComplete="tel"']
)

# Pincode label
ob = add_htmlfor_to_label(ob, 'Pincode</label>', 'onboarding-pincode')

# Pincode input
ob = insert_before_value_with_context(
    ob,
    "value={address.pincode}",
    "handlePincodeChange(",
    ['id="onboarding-pincode"', 'name="pincode"', 'autoComplete="postal-code"']
)

# City label (in Onboarding, near handleAddressChange('city'))
# There are two City labels - one in Onboarding and one in ProfileSettings
# For Onboarding specifically we target the one near handleAddressChange
def add_htmlfor_to_label_with_context(content, label_text, htmlfor_value, context_within_chars):
    """Add htmlFor to a label, only if context_within_chars appears within N chars after the label."""
    pattern = re.compile(
        r'(<label )(?!.*htmlFor)(className="[^"]*">)(' + re.escape(label_text) + r'</label>)'
    )
    matches = list(pattern.finditer(content))
    # Find the match that has context nearby
    target = None
    for m in matches:
        # look within next 500 chars after the label
        nearby = content[m.end():m.end()+500]
        if context_within_chars in nearby:
            target = m
            break
    if target is None:
        print(f"WARNING: could not find label '{label_text}' with context")
        return content
    replacement = target.group(1) + 'htmlFor="' + htmlfor_value + '" ' + target.group(2) + target.group(3)
    return content[:target.start()] + replacement + content[target.end():]

ob = add_htmlfor_to_label_with_context(ob, 'City</label>', 'onboarding-city', "handleAddressChange('city'")

# City input
ob = insert_before_value_with_context(
    ob,
    "value={address.city}",
    "handleAddressChange('city'",
    ['id="onboarding-city"', 'name="city"', 'autoComplete="address-level2"']
)

# line1 input
ob = insert_before_value_with_context(
    ob,
    "value={address.line1}",
    "handleAddressChange('line1'",
    ['id="onboarding-line1"', 'name="line1"', 'autoComplete="address-line1"']
)

# line2 input
ob = insert_before_value_with_context(
    ob,
    "value={address.line2}",
    "handleAddressChange('line2'",
    ['id="onboarding-line2"', 'name="line2"', 'autoComplete="address-line2"']
)

# landmark input
ob = insert_before_value_with_context(
    ob,
    "value={address.landmark}",
    "handleAddressChange('landmark'",
    ['id="onboarding-landmark"', 'name="landmark"']
)

# state input
ob = insert_before_value_with_context(
    ob,
    "value={address.state}",
    "handleAddressChange('state'",
    ['id="onboarding-state"', 'name="state"', 'autoComplete="address-level1"']
)

with open(r'components\Onboarding.tsx', 'w', encoding='utf-8') as f:
    f.write(ob)
print("Onboarding.tsx done.")


# ─── ProfileSettingsModal.tsx ─────────────────────────────────────────────────

with open(r'components\ProfileSettingsModal.tsx', 'r', encoding='utf-8') as f:
    ps = f.read()

# Pincode label
ps = add_htmlfor_to_label_with_context(ps, 'Pincode</label>', 'profile-pincode', 'handlePincodeChange(')

# Pincode input
ps = insert_before_value_with_context(
    ps,
    "value={address.pincode}",
    "handlePincodeChange(",
    ['id="profile-pincode"', 'name="pincode"', 'autoComplete="postal-code"']
)

# City label
ps = add_htmlfor_to_label_with_context(ps, 'City</label>', 'profile-city', "setAddress(prev => ({...prev, city:")

# City input
ps = insert_before_value_with_context(
    ps,
    "value={address.city}",
    "setAddress(prev => ({...prev, city:",
    ['id="profile-city"', 'name="city"', 'autoComplete="address-level2"']
)

# line1 input
ps = insert_before_value_with_context(
    ps,
    "value={address.line1}",
    "setAddress(prev => ({...prev, line1:",
    ['id="profile-line1"', 'name="line1"', 'autoComplete="address-line1"']
)

# line2 input
ps = insert_before_value_with_context(
    ps,
    "value={address.line2}",
    "setAddress(prev => ({...prev, line2:",
    ['id="profile-line2"', 'name="line2"', 'autoComplete="address-line2"']
)

# landmark input
ps = insert_before_value_with_context(
    ps,
    "value={address.landmark}",
    "setAddress(prev => ({...prev, landmark:",
    ['id="profile-landmark"', 'name="landmark"']
)

# state input
ps = insert_before_value_with_context(
    ps,
    "value={address.state}",
    "setAddress(prev => ({...prev, state:",
    ['id="profile-state"', 'name="state"', 'autoComplete="address-level1"']
)

with open(r'components\ProfileSettingsModal.tsx', 'w', encoding='utf-8') as f:
    f.write(ps)
print("ProfileSettingsModal.tsx done.")
