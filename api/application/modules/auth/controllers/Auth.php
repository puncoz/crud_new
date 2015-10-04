<?php defined('BASEPATH') OR exit('No direct script access allowed');

/*
 *	Authentication Controller
 */
class Auth extends CI_Controller {

	/*
	 *	variable to hold data for view
	 */
	private static $viewData = array();

	/*
	 *	Constructor
	 */
	public function __construct() {
		parent::__construct();

		// load admin model
		//$this->load->model('admin_model');
		$this->load->helper(array('language'));

		$this->lang->load('auth');
	}

	/*
	 *	Index Page
	 */
	public function index() {
		if (!$this->ion_auth->logged_in()) {
			//redirect them to the login page
			redirect('admin/login', 'refresh');
		} else if (!$this->ion_auth->is_admin()) {
			//redirect them to the home page because they must be an administrator to view this
			return show_error('You must be an administrator to view this page.');
		} else {
			redirect('admin', 'refresh');
		}
	}

	/*
	 *	Login Page
	 */
	public function login() {
		// check for logged in or not
		if ($this->ion_auth->logged_in()) {
			// if loggged in, redirect them to the dashboard page
			redirect('admin', 'refresh');
		}

		//validate form input
		$this->form_validation->set_rules('identity', 'Username', 'required');
		$this->form_validation->set_rules('password', 'Password', 'required');

		if (!$this->form_validation->run()) {
			// display the form
			self::$viewData['page_info'] = array(
											'title' => 'Login || DMLI Admin Panel',
											'meta_keywords' => 'dmli',
											'meta_description' => 'dmli'
										);
			$requested_url = $this->session->flashdata('requested_url');
			self::$viewData['requested_url'] = ($requested_url == '') ? 'admin' : $requested_url;

			$this->load->view(ADMIN_TMPL.'/index_login',self::$viewData);
		} else {
			// check for "remember me"
			$remember = (bool) $this->input->post('rememberme');
			$identity = $this->input->post('identity');
			$password = $this->input->post('password');

			// check to see if the user is logging in
			if ($this->ion_auth->login($identity, $password, $remember)) {
				// login is successful
				// redirect them back to the dashboard
				$this->session->set_flashdata('success_msg', 'Welcome to DMLI Admin Panel!!!');
				$requested_url = $this->input->post('requested_url');
				redirect($requested_url, 'refresh');
			} else {
				// login was un-successful
				// redirect them back to the login page
				$this->session->set_flashdata('error_msg', $this->ion_auth->errors());
				redirect('admin/login', 'refresh'); //use redirects instead of loading views for compatibility with MY_Controller libraries
			}
		}
	}

	/*
	 *	Log the user out
	 */
	public function logout() {
		if($this->ion_auth->logged_in()) {
	    	// log the user out
	        $logout = $this->ion_auth->logout();

			// redirect them to the login page
			$this->session->set_flashdata('success_msg', $this->ion_auth->messages());
    	} else {
    		$this->session->set_flashdata('warning_msg', 'You must log in to continue.');
    	}

		redirect('admin/login', 'refresh');
	}

} // end of Authentication Class Controller