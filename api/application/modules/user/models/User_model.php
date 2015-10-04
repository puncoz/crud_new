<?php defined('BASEPATH') OR exit('No direct script access allowed');

/*
 *	User Model
 */
class User_model extends CI_Model {

	/*
	 *	Constructor
	 */
	public function __construct() {
		parent::__construct();
	}

	/*
	 * Login User
	 */
	public function login_user($identity, $password) {
		if ($this->ion_auth->login($identity, $password)) {
			// login is successful
			// create session_key and update in database
			return $this->generate_session($identity);
		} else {
			// login was un-successful
			return false;
		}
	}

	/*
	 * Generate Session key
	 */
	private function generate_session($username) {
		$key = md5(microtime().rand());
		if(!$this->checkUserExists($username)) {
			// echo mdate("%Y-%m-%d %H:%i:%s", now());
			$this->db->insert('rest_user_loggedin', array('username'=>$username, 'sess_key'=>$key, 'date_loggedin'=>mdate("%Y-%m-%d %H:%i:%s", now())));
		} else {
			$this->db->where('username', $username);
			$this->db->update('rest_user_loggedin', array('sess_key'=>$key, 'date_loggedin'=>mdate("%Y-%m-%d %H:%i:%s", now())));
		}
		return $key;
	}

	/*
	 * Check for user already logged in or not
	 */
	private function checkUserExists($username) {
		$count = $this->db->where('username', $username)
					->from('rest_user_loggedin')
					->count_all_results();

		return ($count > 0) ? true : false;
	}

	/*
	 * Check for user login
	 */
	private function checkUserSession($sess_key) {
		$user = $this->db->where('sess_key', $sess_key)
					->from('rest_user_loggedin')
					->get();

		if($user->num_rows() > 0) {
			return $user->row()->username;
		}
		return false;
	}

	/*
	 * Get User Details
	 */
	public function getUserDetails($sess_key) {
		$username = $this->checkUserSession($sess_key);

		if($username === false) {
			return false;
		}

		$user = $this->db->select('first_name, last_name, gender, profile_picture')
					->where('username', $username)
					->get('users')->row();
		$user->gender = ($user->gender == '1') ? 'Female' : 'Male';
		return $user;
	}

	/*
	 * Update User Profile
	 */
	public function updateUserProfile($sess_key, $updateData) {
		$username = $this->checkUserSession($sess_key);

		if($username === false) {
			return false;
		}

		$this->db->where('username', $username)
					->update('users', $updateData);

		if($this->db->affected_rows() > 0) {
			return true;
		} else {
			return 'Nothing Updated!!!';
		}
	}

	/*
	 * Update User Profile Picture
	 */
	public function updateUserProfilePic($sess_key, $image) {
		$username = $this->checkUserSession($sess_key);

		if($username === false) {
			return false;
		}

		if(empty($image)) return false;

		$this->db->where('username', $username)
					->update('users', array('profile_picture'=>$image));

		if($this->db->affected_rows() > 0) {
			return true;
		} else {
			return 'Nothing Updated!!!';
		}
	}

} // end of Username Model