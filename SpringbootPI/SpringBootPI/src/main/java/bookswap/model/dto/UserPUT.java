package bookswap.model.dto;

public class UserPUT {
	private String oldName;
	private String newName;
	private String password;
	private String profilePicture;
	
	public UserPUT(String oldName, String newName, String password, String profilePicture) {
		this.oldName = oldName;
		this.newName = newName;
		this.password = password;
		this.profilePicture = profilePicture;
	}
	
	public UserPUT() {
		
	}

	public String getOldName() {
		return oldName;
	}

	public void setOldName(String oldName) {
		this.oldName = oldName;
	}

	public String getNewName() {
		return newName;
	}

	public void setNewName(String newName) {
		this.newName = newName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
}
