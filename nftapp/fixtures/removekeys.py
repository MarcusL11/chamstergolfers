import json

# Read the json file named golfers_fixtures.json
with open("golfers_fixture.json", "r") as read_file:
    data = json.load(read_file)

# Iterate over each item in the data list
for item in data:
    # Access the "fields" dictionary inside each item and remove specified keys
    # fields = item["fields"]
    # del fields["data_uri"]
    # del fields["thumbnail_uri"]
    # del fields["preview_uri"]

    item["model"] = "nftapp.Chamster"

# Write the modified data back to the file
with open("golfers_fixture.json", "w") as write_file:
    json.dump(data, write_file, indent=2)


