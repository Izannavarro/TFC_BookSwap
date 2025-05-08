import java.util.ArrayList;

public class Utilities {
	
	public static int findToken(ArrayList<String> tokens, String token) {
		for (int i = 0; i < tokens.size(); i++) {
			if (tokens.get(i).equals(token)) {
				return i;
			}
		}
		return -1;
	}
	
	public static boolean checkUser(ArrayList<String> tokens, String token) {
		for (String tok : tokens) {
			if (tok.equals(token)) {
				return true;
			}
		}
		return false;
	}
}
