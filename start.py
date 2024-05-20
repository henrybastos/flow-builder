import subprocess

powershell_command = "pnpm dev --host"  # Example command

# Capture output and error stream
# process = subprocess.run(["ls"], capture_output=True, text=True)
process = subprocess.run(["powershell", "-Command", powershell_command], capture_output=True, text=True)
# process = subprocess.run(["pnpm", "dev", "--host", "5174"], capture_output=True, text=True)

# Check for errors
if process.returncode != 0:
  print(f"Error: {process.stderr}")
else:
  # Access the output
  output = process.stdout
  print(output)