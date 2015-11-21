/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.pitt.sis.is2140.rest;

import edu.pitt.sis.is2140.core.AnswerRanking;
import edu.pitt.sis.is2140.core.StackOverFlowAPI;
import edu.pitt.sis.is2140.viewModel.Answer;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Wu
 */
@Controller
@RequestMapping("/rest/answers")
public class AnswersRestAPI {

    public AnswersRestAPI() {
        //Initialize controller properties here or 
        //in the Web Application Context

        //setCommandClass(MyCommand.class);
        //setCommandName("MyCommandName");
        //setSuccessView("successView");
        //setFormView("formView");
    }

    /**
     * Search Answers
     *
     * @param key
     * @return list of answers
     */
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ResponseBody
    public List<Answer> searchAnswers(@RequestParam("key") String key) {
        List<Answer> res = null;
        if (key.length() != 0) {
            res = StackOverFlowAPI.searchRelevantAnswer(key);
            AnswerRanking.ranking(res);
        }
        return res;
    }

}
