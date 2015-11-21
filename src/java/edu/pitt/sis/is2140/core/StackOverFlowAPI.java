/*
 * The class is used for invoking stackover apis
 */
package edu.pitt.sis.is2140.core;

import edu.pitt.sis.is2140.viewModel.Answer;
import java.util.List;

/**
 *
 * @author Wu
 */
public class StackOverFlowAPI {

    /**
     * Use StackOverFlow API to retrieval questions
     * /2.2/search/advanced?order=desc&sort=relevance&q=key&answers=1&site=stackoverflow where
     * filter can be configured
     *
     * @param key
     * @return
     */
    public static List<Answer> searchRelevantAnswer(String key) {
        return null;
    }

    /**
     * Use StackOverFlow API to retrieval answers by question id
     * /2.2/questions/15182496/answers?order=desc&sort=activity&site=stackoverflow&filter=!9YdnSM68i
     * where filter can be configured
     *
     * @param id
     * @return
     */
    private static List<Answer> searchAnswers(String q_id) {
        return null;
    }

}
