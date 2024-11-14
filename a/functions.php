add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/chatgpt', array(
        'methods' => 'POST',
        'callback' => 'handle_chatgpt_request',
        'permission_callback' => '__return_true',
    ));
});

function handle_chatgpt_request(WP_REST_Request $request) {
    $body = json_decode($request->get_body(), true);

    $api_key = 'la clé api sera ici dans les guillemets';

    $response = wp_remote_post('https://api.openai.com/v1/chat/completions', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $api_key,
        ),
        'body' => json_encode(array(
            'model' => 'gpt-3.5-turbo',
            'messages' => $body['messages'],
        )),
    ));

    if (is_wp_error($response)) {
        return new WP_REST_Response(array('error' => 'Erreur de communication avec OpenAI'), 500);
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    return new WP_REST_Response($data, 200);
}
